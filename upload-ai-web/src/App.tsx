import { Button } from "./components/ui/button";
import { Github, FileVideo, Upload, Wand2 } from 'lucide-react'
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Slider } from "./components/ui/slider";

export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">upload.ai</h1>


        <div className="flex gap-3 items-center">
          <span className="text-sm text-muted-foreground hidden lg:block">
            Desenvolvido no NLW da Rocketseat
          </span>

          {/* Por padrão ele vem na horizontal, mudando para vertical e definindo um tamanho */}
          <Separator orientation="vertical" className="h-6 hidden lg:block" />

          <Button variant={"outline"}>
            <Github className="w-4 h-4 mr-2" />
            Github
          </Button>
        </div>
      </header>

      {/* Main */}
      {/* Flex-1 vai fazer ocupar o restante da altura limitado pela div pai */}
      <main className="flex-1 p-6 flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col flex-1 gap-4">
          {/* textareas */}
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              // resize-none para não deixar o usuário modificar o tamanho
              className="resize-none p-5 leading-relaxed"
              placeholder="Inclua o prompt para a IA..."
            />

            <Textarea
              className="resize-none p-5 leading-relaxed"
              placeholder="Resultado gerado pela IA..."
              readOnly
            />
          </div>

          <p className="text-xs lg:text-sm text-muted-foreground">
            Lembre-se: você pode utilizar a variável <code className="text-violet-500">{'{transcription}'}</code> no seu prompt para adicionar o conteúdo da transicrição do video selecionado
          </p>

        </div>

        <aside className="lg:w-1/5 space-y-6">
          {/* Formulário 1  - carregar o vídeo */}
          <form className="space-y-6 ">
            <label htmlFor="video" className="border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5">

              <FileVideo className="w-5 h-5" />
              Selecione um vídeo
            </label>

            {/* accept="video/mp4" -> Somente aceita arquivos do tipo .mp4 */}
            <input type="file" id="video" accept="video/mp4" className="sr-only" />

            <Separator />

            <div className="space-y-1">
              <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
              <Textarea
                id="transcription_prompt"
                className="h-16 leading-relaxed resize-none"
                placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula"
              />
            </div>

            <Button type="submit" className="w-full">
              Carregar vídeo
              <Upload className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Formulário 2 */}
          <form className="space-y-5">
            {/* Prompt */}
            <div className="space-y-1">
              <Label>
                Prompt
              </Label>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um prompt"/>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="title">Título do YouTube</SelectItem>
                  <SelectItem value="description">Descrição do YouTube</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">Você poderá customizar esta opção em breve</span>
            </div>

            {/* Versão da openAI */}
            <div className="space-y-2">
              <Label>
                Modelo
              </Label>

              {/* Fazendo o select iniciar com o valor default e não podendo ser modificado */}
              <Select disabled defaultValue="gpt3.5">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">Você poderá customizar esta opção em breve</span>
            </div>

            <Separator />

            {/* Temperatura da resposta */}
            <div className="space-y-4">
              <Label>
                Temperatura
              </Label>

              <Slider
                min={0}
                max={1}
                step={0.1}
              />

              <span className="block text-xs text-muted-foreground italic leading-relaxed">
                Valores mais altos tendem a deixar o resultado mais criativo e com possíveis erros.
              </span>
            </div>


            <Separator />

            <Button type="submit" className="w-full">
              Executar
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  )
}